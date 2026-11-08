interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export const useCartStore = defineStore("cart", () => {
  //state
  const items = ref<CartItem[]>([]);
  //getters
  const totalCount = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  });

  //actions

  const addToCart = (product: Product) => {
    const existingItem = items.value.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({
        ...product,
        quantity: 1,
      });
    }
  };

  const removeFromCart = (productId: number) => {
    const existingItem = items.value.find((item) => item.id === productId);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity--;
      } else {
        items.value = items.value.filter((item) => item.id !== productId);
      }
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    totalCount,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
  };
});
