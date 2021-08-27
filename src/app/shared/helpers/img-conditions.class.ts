export class ImgConditions {
  constructor() {}

  existImg(event: any): boolean {
    if (event.target.files.length == 0) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'No hay imagen',
      // });
      return false;
    }
    return true;
  }

  sizeImg(file: File, size: number): boolean {
    if (file.size >= size) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'La imagen no puede superar los 4mb',
      // });
      return false;
    }
    return true;
  }

  typesImg(file: File, types: string[]): boolean {
    if (!types.includes(file.type)) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'No es una imagen',
      // });
      return false;
    }
    return true;
  }
}
