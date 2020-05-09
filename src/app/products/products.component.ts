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
  productOpen: boolean;
  delete = false;
  productToBeDeleted: IProduct;
  selectedProduct: IProduct;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }

  addProduct() {
    this.productOpen = true;
    this.selectedProduct = undefined;
  }

  onEdit(product: IProduct) {
    this.productOpen = true;
    this.selectedProduct = product;
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

  handleFinish(event) {
    if (event && event.product) {
      if (!!this.selectedProduct) {
        this.productService.editProduct(this.selectedProduct.id, event.product);
      } else {
        this.productService.addProduct(event.product);
      }
    }
    this.productOpen = false;
  }
}
