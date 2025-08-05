import OrderForm from './OrderForm';

export default function Page({ params }: { params: { productId: string } }) {
  return <OrderForm productId={params.productId} />;
}
