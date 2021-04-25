import { useState } from 'react';
import { useQuery } from 'react-query';
//Components
import Item from './components/Item';
import Cart from './components/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
//Styles
import { Wrapper, StyledButton } from './App.styles';
//types
export type CartItemType = {
	id: number;
	category: string;
	description: string;
	image: string;
	price: number;
	title: string;
	amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
	await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
	const [cartOpen, setCartOpen] = useState(false);
	const [cartItems, setCartItems] = useState([] as CartItemType[]);
	const { data, isLoading, error } = useQuery<CartItemType[]>(
		'products',
		getProducts
	);
	console.log(data);

	const getTotalItems = (items: CartItemType[]) =>
		items.reduce((acc: number, item) => acc + item.amount, 0);

	const handleAddToCart = (item: CartItemType) => {
		setCartItems((prev) => {
			// is item already in Cart
			const isItemAlreadyInCart = prev.find((el) => el.id === item.id);
			if (isItemAlreadyInCart) {
				return prev.map((el) =>
					el.id === item.id ? { ...item, amount: el.amount + 1 } : el
				);
			}
			// first time item added
			return [...prev, { ...item, amount: 1 }];
		});
	};

	const handleRemoveFromCart = (id: number) => {
		setCartItems((prev) => {
			return prev.reduce((acc, item) => {
				if (item.id === id) {
					if (item.amount === 1) return acc;
					return [...acc, { ...item, amount: item.amount - 1 }];
				} else {
					return [...acc, item];
				}
			}, [] as CartItemType[]);
		});
	};

	if (isLoading) return <LinearProgress />;
	if (error) return <div>Something went wrong...</div>;

	return (
		<Wrapper>
			<Drawer
				anchor='right'
				open={cartOpen}
				onClose={() => setCartOpen(false)}
			>
				<Cart
					cartItems={cartItems}
					addToCart={handleAddToCart}
					removeFromCart={handleRemoveFromCart}
				/>
			</Drawer>
			<StyledButton onClick={() => setCartOpen(true)}>
				<Badge badgeContent={getTotalItems(cartItems)} color='error'>
					<AddShoppingCart />
				</Badge>
			</StyledButton>
			<Grid container spacing={3}>
				{data?.map((item) => (
					<Grid item key={item.id} xs={12} sm={4}>
						<Item item={item} handleAddToCart={handleAddToCart} />
					</Grid>
				))}
			</Grid>
		</Wrapper>
	);
};

export default App;
