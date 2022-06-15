import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { navItems } from './_nav';
import { io } from 'socket.io-client';
import { first } from 'rxjs/operators';
import { Envio } from '../../class/envio';
import { Proceso } from '../../class/proceso';
import { Consulta } from '../../class/consulta';
import { tipoProceso } from '../../class/tipo_proceso';
import { IconSetService } from '@coreui/icons-angular';
import { CabezeraEnvio } from '../../class/cabezeraEnvio';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ParametrosEnvio } from '../../class/parametrosEnvio';
import { environment } from './../../../environments/environment';
import { ProcesoService } from './../../services/proceso.service';
import { cilDelete, cilSave, cilFolder, cilFolderOpen } from '@coreui/icons';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})

export class DefaultLayoutComponent implements AfterViewInit, OnInit {

  socket = io(environment.apiUrl);

  //variables control
  colorConsultar = 'blue';
  colorGuardar: string = 'gray';
  controlGuardar: boolean = true;
  controlConsultar: boolean = false;
  loadingConsultar: boolean = false;
  colorNotificacion: string = 'gray';
  controlNotificacion: boolean = true;
  loadingEnviarNotificaciones: boolean = false;
  //

  //variables de archivo
  public navItems = navItems;
  public upload: boolean = false;
  opcionRadio: string = "";
  title: String = "XlsRead";
  file!: File;
  arrayBuffer: any;
  //fin

  //variables del tabla
  closeResult = '';
  idIntegracion = 0;
  respuesta: string = "";
  columnasName: string[] = [];
  arregloTranscision: any[] = [];
  cabezeraEnvioDetalle: any[] = [];
  notificacionesEnviadas: any[] = [];
  notificacionesRecibidas: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  selectionCheck = new SelectionModel<any>(true, []);
  //fin

  //variables del detalle de la tabla
  total_row: number = 0;
  columnasNameDetalle: string[] = [];
  dataSourceDetalle = new MatTableDataSource<any>([]);
  //fin

  //variables de documentos de la tabla
  total_documents: number = 0;
  dataDocument: any[] = [];
  columnasNameDocument: string[] = [];
  dataSourceDocument = new MatTableDataSource<any>([]);
  //fin

  //variables para el encabezado
  public fechaConsulta!: Date;
  public listaProcesos: Proceso[] = []
  public opcionSeleccionado: number = 0;
  public listaTipoProcesos: tipoProceso[] = []
  public opcionSeleccionadoTipo: string = "0";
  //fin

  isAllSelected() {
    const numSelected = this.selectionCheck.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selectionCheck.clear();
      return;
    }
    this.selectionCheck.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionCheck.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  //aqui terminare xD

  consultar() {
    console.log("this.opcionSeleccionado",this.opcionSeleccionado)
    if (this.opcionSeleccionado == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un proceso'
      })
      return
    }
    if (this.opcionSeleccionadoTipo == "0") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un tipo de proceso'
      })
      return
    }
    if (this.fechaConsulta == undefined || this.fechaConsulta.toString() == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar una fecha del proceso'
      })
      return
    }
    this.loadingConsultar = true
    this.controlGuardar = true;
    let tempPro = this.listaProcesos.find(x => x.idnwitipoproceso == this.opcionSeleccionado)
    let tempTipo = this.listaTipoProcesos.find(x => x.codintegracion == this.opcionSeleccionadoTipo)
    console.log("envio tio es",tempTipo)
    let data: Consulta = {
      tipo_proceso: tempPro?.codproceso,
      tipo_integracion: tempTipo?.codintegracion,
      fecha_produccion: this.fechaConsulta.toString(),
      id_tipo_integracion: tempTipo?.idnwitipointegracion,
    }
    console.log("envio consulta",data)
    this.procesoServie.listarNotificaciones(data)
      .pipe(first())
      .subscribe(
        lista => {
          this.loadingConsultar = false
          this.controlConsultar = true
          this.colorConsultar = 'gray';
          this.controlNotificacion = false
          this.colorNotificacion = 'rgb(19, 184, 19)'
          this.cabezeraEnvioDetalle = lista.campos
          let tempArray: any[] = [];
          let index: number = 1;
          lista.data.forEach((dat: any) => {
            let temp = JSON.parse(dat.data)
            temp.POSICION = index
            temp.status = false
            temp.estadoRespuesta = 0
            temp.documentosRespuestas = {}
            temp.message = ""
            index = index + 1;
            tempArray.push(temp)
          });
          // 
          this.selectionCheck.clear();
          this.columnasName = []
          this.columnasName.push("select")
          var names = Object.keys(tempArray[0])
          names.forEach(element => {
            this.columnasName.push(element)
          });
          this.columnasName.push("estado")
          this.columnasName.push("acciones")
          this.columnasName = this.columnasName.filter((item) => item !== 'detalles')
          this.columnasName = this.columnasName.filter((item) => item !== 'POSICION')
          this.columnasName = this.columnasName.filter((item) => item !== 'status')
          this.columnasName = this.columnasName.filter((item) => item !== 'estadoRespuesta')
          this.columnasName = this.columnasName.filter((item) => item !== 'message')
          this.columnasName = this.columnasName.filter((item) => item !== 'documentosRespuestas')
          this.arregloTranscision = tempArray
          this.dataSource = new MatTableDataSource<any>(tempArray);
          this.dataSource.paginator = this.paginator;
          this.controlGuardar = false
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrio un en el servidor al traer las notificaciones'
          })
          this.loadingConsultar = false
          this.controlGuardar = false
        }
      );
  }

  capturar() {
    this.listaTipoProcesos = [];
    this.opcionSeleccionadoTipo = "0";
    if (this.opcionSeleccionado !== 0) {
      this.procesoServie.listaTipoProcesos(this.opcionSeleccionado)
        .pipe(first())
        .subscribe(
          lista => {
            console.log("lista de tipo proceso",lista)
            this.listaTipoProcesos = lista
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrio un en el servidor al traer las integraciones'
            })
          }
        );
    } else {
      this.opcionSeleccionado = 0
    }
  }

  capturarDate(date: any) {
    this.fechaConsulta = date.target.value
  }

  capturarTipo() {
    // this.verSeleccionTipo = this.opcionSeleccionadoTipo;
    console.log("this.opcionSeleccionadoTipo", this.opcionSeleccionadoTipo)
  }

  radioChangeHandler(event: any) {
    this.upload = false;
    this.opcionRadio = event.target.value;
    if (this.opcionRadio == "excel") {
      this.upload = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addfile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (_e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      var names = Object.keys(arraylist[0])
      this.columnasName = [];
      this.dataSource = new MatTableDataSource<any>([])
      this.columnasName.push("select")
      names.forEach(element => {
        this.columnasName.push(element)
      });
      this.columnasName.push("acciones")
      this.dataSource = new MatTableDataSource<any>(arraylist);
      this.dataSource.paginator = this.paginator;
    }
  }

  isObjEmpty(obj:{}) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  enviarNotificacion() {
    this.loadingEnviarNotificaciones = true
    //this.colorNotificacion = 'gray'
    let tempPro = this.listaProcesos.find(x => x.idnwitipoproceso == this.opcionSeleccionado)
    let tempTipo = this.listaTipoProcesos.find(x => x.codintegracion == this.opcionSeleccionadoTipo)
    let tempDetalle: any[] = []
    this.selectionCheck.selected.forEach(element => {
      let tempNot: any = {}
      if(!element.status){
        for (let index = 0; index < this.cabezeraEnvioDetalle.length; index++) {
          const cabezera = this.cabezeraEnvioDetalle[index];
          if(cabezera.descripcion == "posicion"){
            tempNot[cabezera.descripcion] = element['POSICION'];
          }else{
            tempNot[cabezera.descripcion] = element[cabezera.descripcion];
          }
        }
        tempDetalle.push(tempNot)
      }
    });
    console.log("Esto le estoy enviando.,..",tempDetalle)
    let tempCabezera: CabezeraEnvio = {
      TIPO_PROCESO: tempPro?.codproceso,
      TIPO_INTEGRACION: tempTipo?.codintegracion,
      FECHA_PRODUCCION: this.fechaConsulta.toString()
    }
    let tempParametros: ParametrosEnvio = {
      tipo_proceso: tempPro?.codproceso,
      tipo_integracion: tempTipo?.codintegracion,
      fecha_produccion: this.fechaConsulta.toString()
    }
    let tempEnvio: Envio = {
      jsonParametros: tempParametros,
      jsonCabecera: tempCabezera,
      detalle: tempDetalle
    }
    console.log("envio notificacion",tempEnvio)
    this.procesoServie.enviarNotificaciones(tempEnvio)
      .pipe(first())
      .subscribe(
        result => {
          let tipoMsn:any = "error"
          console.log("notificaciones recibida",result)
          if(result.data.respuesta_sap.E_RETURN.CODE == "S"){
            tipoMsn = "success"
            console.log("checkes seleccionados son",this.selectionCheck.selected)
           
            let temArray:any[]=[];
            this.selectionCheck.selected.forEach(element => {
              if(!element.status){
                //element.status = true
                temArray.push(element)
              }
            });
            console.log("Esto le estoy comprobando.,..",temArray)
            this.arregloTranscision.forEach((element,index) => {
              temArray.forEach(subelement => {
                if(element.POSICION == subelement.POSICION){
                  this.arregloTranscision[index].status = true
                }
              });
            });
            console.log("Esto le estoy comprobandoCheck.,..",this.arregloTranscision)
            this.dataSource = new MatTableDataSource<any>(this.arregloTranscision);
            this.dataSource.paginator = this.paginator;
          }
          Swal.fire({
            icon: tipoMsn,
            title: "Exito",
            //text: result.data.respuesta_sap.E_RETURN.MSG
            text: "ENVIADO A SAP CORRECTAMENTE"
          })
          this.loadingEnviarNotificaciones = false
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrio un en el servidor al enviar'
          })
          this.loadingEnviarNotificaciones = false
        }
      );
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private modalService: NgbModal,
    public iconSet: IconSetService,
    private procesoServie: ProcesoService,
  ) {
    iconSet.icons = { cilSave, cilDelete, cilFolder, cilFolderOpen };
    //this.prepareTableRows();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDocumento(content: any, data: any) {
    //this.respuesta = datatre
    this.dataDocument = []
    this.columnasNameDocument = []
    this.dataSourceDocument = new MatTableDataSource<any>([])
    console.log("datadata",data)
    if(!this.isObjEmpty(data)){
      this.columnasNameDocument.push("Nombre")
      this.columnasNameDocument.push("Documento")
      let temp:any[] = []
      var names = Object.keys(data) 
      names.forEach(element => {
        temp.push({Nombre:element,Documento:data[element]})
      });
      this.dataDocument = temp
      this.dataSourceDocument = new MatTableDataSource<any>(temp);
    }else{
      this.dataDocument = []
    }
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-documentos-table' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRespuesta(content: any, data: any) {
    this.respuesta = data
    console.log("message",data)
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-detalle-row' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content: any, data: any) {
    this.columnasNameDetalle = []
    this.dataSourceDetalle = new MatTableDataSource<any>([])
    var names = Object.keys(data.detalles[0])
    names.forEach(element => {
      this.columnasNameDetalle.push(element)
    });
    this.total_row = data.detalles.length
    this.dataSourceDetalle = new MatTableDataSource<any>(data.detalles);
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-detalle-row' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.procesoServie.listaProcesos()
      .pipe(first())
      .subscribe(
        lista => {
          this.listaProcesos = lista
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrio un en el servidor al traer los procesos'
          })
        }
      );
      //this.procesoServie.obtenerData()
      this.obtenerData()
      //console.log("notificaciones recibidas front",this.procesoServie.obtenerData())
      /*
      }*/

  }
  obtenerData(){
    this.socket.on('recibir-notificaciones',(notificaciones)=>{
        console.log("notificaciones recibidas services",notificaciones);
        console.log("notificaciones recibidas services",notificaciones.length);
        if(notificaciones.length>0){
          notificaciones.forEach((element:any) => {
              element.DETALLE.forEach((subelement:any,index:any) => {
                this.arregloTranscision.forEach((trans,indexTrans) => {
                  if(trans.POSICION == subelement.POSICION){
                    if(subelement.ESTATUS == 2){
                      this.arregloTranscision[indexTrans].status = false
                    }
                    this.arregloTranscision[indexTrans].message = subelement.MENSAJE
                    this.arregloTranscision[indexTrans].documentosRespuestas = subelement.RESULTADO
                    this.arregloTranscision[indexTrans].estadoRespuesta = parseInt(subelement.ESTATUS)
                  }
                });
              });
          });
          console.log("data final",this.arregloTranscision)
          this.dataSource = new MatTableDataSource<any>(this.arregloTranscision);
          this.dataSource.paginator = this.paginator;
        }
        //return notificaciones;
    })
    
  }
}