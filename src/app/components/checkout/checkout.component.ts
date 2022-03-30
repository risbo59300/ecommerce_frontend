import { CartService } from './../../services/cart.service';
import { LuDivValidators } from './../../validators/lu-div-validators';
import { State } from './../../common/state';
import { Country } from './../../common/country';
import { FormService } from './../../services/form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0 ;
  totalQuantity: number = 0 ;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formService : FormService,
    private cartService : CartService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.fb.group({
      customer: this.fb.group({
        firstName: ["",
                    [
                      Validators.required,
                      Validators.minLength(2),
                      LuDivValidators.notOnlyWhitespace
                    ]
        ],
        lastName: ["",
                     [
                       Validators.required,
                        Validators.minLength(2),
                         LuDivValidators.notOnlyWhitespace
                     ]
        ],
        email: ["", 
                  [
                    Validators.required, 
                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                  ]
        ]
      }),
      shippingAddress: this.fb.group({
        street: ["",
                    [
                      Validators.required,
                      Validators.minLength(2),
                      LuDivValidators.notOnlyWhitespace
                    ]
        ],
        city: ["",
                    [
                      Validators.required,
                      Validators.minLength(2),
                      LuDivValidators.notOnlyWhitespace
                    ]
        ],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode:["",
                    [
                      Validators.required,
                      Validators.minLength(2),
                      LuDivValidators.notOnlyWhitespace
                    ]
        ],
      }),
      billingAddress: this.fb.group({
        street: ["",
                    [
                      Validators.required,
                      Validators.minLength(2),
                      LuDivValidators.notOnlyWhitespace
                    ]
        ],
        city: ["",
                    [
                      Validators.required,
                      Validators.minLength(2),
                      LuDivValidators.notOnlyWhitespace
                    ]
        ],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode:["",
                    [
                      Validators.required,
                      Validators.minLength(2),
                      LuDivValidators.notOnlyWhitespace
                    ]
        ],
      }),
      creditCard: this.fb.group({
        cardType: ['', Validators.required],
        nameOnCard: ["",
                        [
                          Validators.required,
                          Validators.minLength(2),
                          LuDivValidators.notOnlyWhitespace
                        ]
       ],
        cardNumber: ['',
                        [
                          Validators.required, 
                          Validators.pattern('^[0-9]{16}$'),
                          Validators.maxLength(16),
                        ]
        ],
        securityCode: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
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

  reviewCartDetails() {
    // suscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    ); 

    // suscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  // Create Getter for Customer
  get firstName() { return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() { return this.checkoutFormGroup.get('customer.lastName');}
  get email() { return this.checkoutFormGroup.get('customer.email');}

  // Create Getter for Shipping Address
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country');}

  // Create Getter for Billing Address
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country');}

  // Create Getter for Credit Card
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode');}
 
  /** Copy the shipping address information to the billing address */
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

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

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

