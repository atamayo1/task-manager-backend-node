// src/db.service.ts

import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class DbService {
  private pool: sql.ConnectionPool;

  constructor() {
    this.pool = new sql.ConnectionPool({
      server: 'localhost',
      database: 'taskmanagerdb',
      user: 'anthotamayo',
      password: 'Pass123456789_',
      options: {
        encrypt: true, // Si estás utilizando Azure
        trustServerCertificate: true, // Cambia a false si no confías en el certificado del servidor
      },
    });
    this.pool.connect();
  }

  async query(queryString: string): Promise<any> {
    try {
      const request = this.pool.request();
      const result = await request.query(queryString);
      return result.recordset;
    } catch (error) {
      console.error('Error en la consulta:', error);
      throw error;
    }
  }
}
