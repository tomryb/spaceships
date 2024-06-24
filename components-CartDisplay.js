export default function CartDisplay({ cart }) {
  return (
    <div>
      {cart.items.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <p>{item.price}</p>
        </div>
      ))}
    </div>
  );
}
