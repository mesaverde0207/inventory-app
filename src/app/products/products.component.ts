import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct, ProductService } from '../product.service';

@Component({
  selector: 'in-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  products$: Observable<IProduct[]> = this.productService.products$;
  delete = false;
  productToBeDeleted: IProduct;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }

  addProduct() {
    // TODO: implement the functionality of adding a new product
    return;
  }

  onEdit(product: IProduct) {
    // TODO: add editing functionality
    return;
  }

  onDelete(product: IProduct) {
    this.delete = true;
    this.productToBeDeleted = product;
  }

  handleCancel() {
    this.delete = false;
  }

  confirmDelete() {
    this.handleCancel();
    this.productService.removeProduct(this.productToBeDeleted);
  }

}
