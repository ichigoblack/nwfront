import { environment } from './../../environments/environment'

export function authHeader() {
    return { 'Content-Type':  'application/json', 'Authorization': `Bearer ${environment.token}` };
}