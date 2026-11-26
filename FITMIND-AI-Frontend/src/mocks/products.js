// SAMPLE DATA ONLY. These are not real listings, prices or stock.
// Delete this file once the recommendations API is connected.
const item = (id, title, category, marketplace, price, fit, occasions) =>
  ({ id: `mock-${id}`, title, category, marketplace, price, fit, occasions, imageUrl: null })

export const MOCK_PRODUCTS = [
  item(1, 'Cotton Oxford shirt', 'shirts', 'myntra', 1299, 'regular', ['work', 'casual']),
  item(2, 'Linen relaxed shirt', 'shirts', 'ajio', 1599, 'relaxed', ['casual', 'festive']),
  item(3, 'Slim formal shirt', 'shirts', 'amazon', 999, 'slim', ['formal', 'work']),
  item(4, 'Crew neck cotton T-shirt', 'tshirts', 'flipkart', 499, 'regular', ['casual']),
  item(5, 'Oversized T-shirt', 'tshirts', 'myntra', 699, 'oversized', ['casual']),
  item(6, 'Polo T-shirt', 'tshirts', 'amazon', 849, 'slim', ['casual', 'work']),
  item(7, 'Straight fit chinos', 'trousers', 'ajio', 1499, 'regular', ['work', 'casual']),
  item(8, 'Tapered formal trousers', 'trousers', 'flipkart', 1199, 'slim', ['formal', 'work']),
  item(9, 'Relaxed drawstring trousers', 'trousers', 'amazon', 899, 'relaxed', ['casual']),
  item(10, 'Structured blazer', 'jackets', 'myntra', 3499, 'regular', ['formal', 'work']),
  item(11, 'Nehru jacket', 'jackets', 'ajio', 2299, 'slim', ['festive', 'formal']),
  item(12, 'Casual overshirt jacket', 'jackets', 'flipkart', 1899, 'relaxed', ['casual']),
]
