import VerifyPage from './VerifyPage';

export default function Page({ params }: { params: { order_id: string } }) {
  return <VerifyPage orderId={params.order_id} />;
}
