import { Pipe, PipeTransform } from '@angular/core';
import { ProductUnit } from '../../core/models/product.model';

@Pipe({
  name: 'unitFormat',
  standalone: true
})
export class UnitFormatPipe implements PipeTransform {
  transform(quantity: number, unit: ProductUnit = 'kg'): string {
    if (quantity === null || quantity === undefined) return '';

    if (unit === 'kg') {
      return `${quantity.toFixed(1).replace('.', ',')} kg`;
    }

    if (unit === 'un') {
      return `${quantity} un`;
    }

    if (unit === 'pacote') {
      return `${quantity} ${quantity === 1 ? 'pacote' : 'pacotes'}`;
    }

    if (unit === 'garrafa') {
      return `${quantity} ${quantity === 1 ? 'garrafa' : 'garrafas'}`;
    }

    if (unit === 'lata') {
      return `${quantity} ${quantity === 1 ? 'lata' : 'latas'}`;
    }

    return `${quantity} ${unit}`;
  }
}
