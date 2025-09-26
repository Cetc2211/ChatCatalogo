# **App Name**: Catálogo de Chat Commerce

## Core Features:

- Product Gallery: Display a gallery of products with images, names, descriptions, and prices.
- Buy Now Button: Add a 'Buy Now' button to each product that opens a WhatsApp chat with a pre-defined message including the product name and a business number. The app will use the correct formatting and API calls to create a valid whatsapp url with a message.
- Admin Authentication: Implement a login page (/login) for admin access using email and password via Firebase Auth.
- Product Management: Display a table of all products in the /admin/products route, allowing to edit and delete products. Uses Firebase.
- Add/Edit Product Form: Implement a form (in a dialog/modal) to add new products or edit existing ones, including fields for name, description, price, and image upload to Firebase Storage; all product details must stored using Firestore.
- AI-Powered Description Enhancement: Integrate a button in the product form to generate improved product descriptions using a Genkit tool. Offers the admin user a choice of suggestions to be applied to the product description.

## Style Guidelines:

- Primary color: Deep blue (#2E4765) for trustworthiness and reliability, resonating with commerce and professionalism.
- Background color: Very light desaturated blue (#F0F4F8).
- Accent color: Muted teal (#4B878B) for a touch of sophistication and to highlight important interactive elements without overwhelming the user.
- Body and headline font: 'Inter', a grotesque-style sans-serif, will ensure a clean and modern aesthetic throughout the entire interface.
- Use clear and concise icons from ShadCN's library, aligning with the theme of e-commerce.
- Employ a grid-based layout with a focus on clear spacing and visual hierarchy. Use ShadCN's components for a consistent and responsive design across devices.
- Incorporate subtle animations for transitions and interactions to provide a polished user experience without being distracting.