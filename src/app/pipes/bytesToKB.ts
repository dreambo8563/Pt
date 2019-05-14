import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bytesToKB' })
export class BytesToKBPipe implements PipeTransform {
  transform(bytes: number): string {
    if (bytes > 1024) {
      const formattedNum = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 1
      }).format(bytes / 1024);
      return `${formattedNum}KB`;
    }
    return `${bytes} bytes`;
  }
}
