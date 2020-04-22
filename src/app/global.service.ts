import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public userGlobal: any;
  public avatar: any;

  constructor() { }
}
