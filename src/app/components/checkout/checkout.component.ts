import { State } from './../../common/state';
import { Country } from './../../common/country';
import { FormService } from './../../services/form.service';
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

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(
    private formService : FormService,
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

      })
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1 ;

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieve credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;        
      }
    );

    //populate credit card years

    const startYear: number = new Date().getFullYear() ;
    console.log("startYears " +startYear);

    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieve credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;        
      }
    );

    // populate countries

    this.formService.getCountries().subscribe(
      data => {
        console.log("Retrieve countries: " + JSON.stringify(data));
        this.countries = data;        
      }
    );

    

  }

  /**Copy the shipping address information to the billing address */
  coppyShippingAdressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

        // bug fix for states
        this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.table(this.checkoutFormGroup.get('customer').value);

    console.log("The email address is "+this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping address country is "+this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is "+this.checkoutFormGroup.get('shippingAddress').value.state.name);


    
    
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1; 
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieve credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data; 
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.formService.getStates(countryCode).subscribe(
      data=> {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;          
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
    
  }
  

}

