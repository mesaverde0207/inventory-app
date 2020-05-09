import { Component, OnInit, ChangeDetectionStrategy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { IProduct } from '../product.service';
import * as _ from 'lodash';


@Component({
  selector: 'in-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  @Input() product: IProduct;
  @Output() finish = new EventEmitter();
  @ViewChild('productWizard', { static: false }) productWizard: ClrWizard;
  deviceType = 'tablet';
  deviceTypes = [{
      name: 'Tablet',
      icon: 'tablet',
    }, {
      name: 'Laptop',
      icon: 'computer'
    }, {
      name: 'Phone',
      icon: 'mobile'
    }, {
      name: 'Monitor',
      icon: 'display'
    }];

  constructor(private fb: FormBuilder) {
    this.productForm = fb.group({
      basic: fb.group({
        name: ['', Validators.required],
        description: '',
        active: false,
        features: fb.array([
          fb.control('')
        ])
      }),
      expiration: fb.group({
        expirationDate: [null,
          Validators.compose([Validators.required, minDateValidation(new Date())])]
      })
    })
  }

  ngOnInit(): void {
    if (this.product) {
      this.productForm.setValue({
        basic: {
          ..._.pick(this.product, ['name', 'description', 'active']),
          features: this.product.features || [''],
        },
        expiration: {
          ..._.pick(this.product, ['expirationDate']),
        }
      });
      this.deviceType = this.product.type;
    }
  }

  get basicFeatures(): FormArray {
    return this.productForm.get('basic.features') as FormArray;
  }

  addFeature() {
    this.basicFeatures.push(this.fb.control(''));
  }

  get isBasicInvalid() {
    return this.productForm.get('basic.name').invalid;
  }

  get isExpirationInvalid() {
    return this.productForm.get('expiration').invalid;
  }

  get expirationError() {
    if (this.productForm.get('expiration.expirationDate').hasError('required')) {
      return 'This field is required';
    }
    if (this.productForm.get('expiration.expirationDate').hasError('minDateValidation')) {
      return 'Expiration should be after today\'s date';
    }
  }

  handleCancel() {
    this.finish.emit(null);
    this.close();
  }

  close() {
    this.productForm.reset();
    this.deviceType = 'tablet';
    this.productWizard.goTo(this.productWizard.pageCollection.pages.first.id);
    this.productWizard.reset();
  }

  selectDevice(item: {name: string, icon: string}) {
    this.deviceType = item.icon;
  }

  handleFinish() {
    this.finish.emit({
      product: {
        type: this.deviceType,
        ...this.productForm.get('basic').value,
        ...this.productForm.get('expiration').value,
      }
    });
    this.close();
  }
}

function minDateValidation(date: Date): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = new Date(control.value) < date;
    return forbidden ? {minDateValidation: {value: control.value}} : null;
  };
}
