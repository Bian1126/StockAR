import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

// interfaz tipada para q TypeScript sepa exactamente q campos 
// espera de la API. 
interface DolarData {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

@Injectable()
export class CotizacionService {
  // Cache interno para almacenar la cotización durante 60 segundos y evitar llamadas repetidas
  private cache = { value: 0, ts: 0 };
  private TTL = 60 * 1000; // 60 segundos

  // Método que obtiene todos los tipos de dólar q devuelve la API
  private async fetchAll(): Promise<DolarData[]> {
    const url = 'https://dolarapi.com/v1/dolares';
    const res = await axios.get<DolarData[]>(url, { timeout: 5000 });
    return res.data; // devuelve un array de tipos de dólar 
  }

  // Método auxiliar para convertir strings numéricos con comas y puntos a números
  private parseNumber(raw: string | number | undefined): number | null {
    if (raw === undefined || raw === null) return null;
    if (typeof raw === 'number') return raw;
    const cleaned = String(raw).trim().replace(/\./g, '').replace(',', '.');
    const n = Number(cleaned);
    return isNaN(n) ? null : n;

  }

  // Método público: obtiene el valor de venta del dólar oficial
  async getUsdOficialVenta(): Promise<number> {
    if (this.cache.value && Date.now() - this.cache.ts < this.TTL) {
      return this.cache.value;
    }

    // Si la API falla, devuelve un valor local de respaldo, evitando q la app se rompa
    // garantizando q siempre haya un valor disponible.
    let data: DolarData[];
    try {
      data = await this.fetchAll();
    } catch (err) {
      console.warn('Error al llamar la API, usando valor local de fallback');
      return 1385; // fallback local solo si la API no responde
    }

    // Valida q la API devolvió datos válidos
    if (!data || data.length === 0) {
    throw new NotFoundException('No se encontró el dólar oficial en la API');
  }


    // Recorre el array y busca el dólar oficial comparando el campo 'casa'
    const usd = data.find(d => d.casa.toLowerCase() === 'oficial');
    if (!usd) throw new NotFoundException('No se encontró el dólar oficial en la API');
    // Si no lo encuentra, devuelve un NotFoundException

    // 4) Convertir a número usando parseNumber
    const value = this.parseNumber(usd.venta);
    if (value === null) throw new NotFoundException('Valor de cotización inválido');

    // Guardamos en cache y lo devolvemos como número para usarlo en los cálculos
    this.cache = { value, ts: Date.now() };
    return value;
  }
}