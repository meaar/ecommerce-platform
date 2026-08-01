import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
