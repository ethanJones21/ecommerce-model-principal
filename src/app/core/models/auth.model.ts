export interface ClientForm {
  email: string;
  password: string;
}
export interface ClientApi {
  ok: boolean;
  profile: string;
  token: string;
}
