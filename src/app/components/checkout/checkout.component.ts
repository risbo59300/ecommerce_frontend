import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.fb.group({
      customer: this.fb.group({
        firstName: [""],
        lastName: [""],
        email: [""]
      }),
      shippingAddress: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.fb.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],

      }),
    });
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.table(this.checkoutFormGroup.get('customer').value);   
    
  }

  /**Copy the shipping address information to the billing address */
  coppyShippingAdressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }

  }


}
