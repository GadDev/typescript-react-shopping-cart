import CartItem from './CartItem';
import { Wrapper } from './Cart.styles';
import { CartItemType } from '../../App';

type Props = {
	cartItems: CartItemType[];
	addToCart: (item: CartItemType) => void;
	removeFromCart: (id: number) => void;
};
const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
	const calculateTotal = (items: CartItemType[]) => {
		return items.reduce(
			(acc: number, item) => acc + item.amount * item.price,
			0
		);
	};
	return (
		<Wrapper>
			<h2>Shopping cart</h2>
			{cartItems.length === 0 ? <p>No items in cart</p> : null}
			{cartItems.map((item) => (
				<CartItem
					key={item.id}
					item={item}
					addToCart={addToCart}
					removeFromCart={removeFromCart}
				/>
			))}
			<h2>Totsal: ${calculateTotal(cartItems).toFixed(2)}</h2>
		</Wrapper>
	);
};

export default Cart;
