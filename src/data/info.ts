export interface InfoContent {
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

export const infoData: Record<string, InfoContent> = {
  'sizing-guide': {
    title: 'Sizing Guide',
    subtitle: 'Find your perfect fit',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=600&fit=crop',
    content: `At Nasseg, we believe that the perfect fit is the foundation of elegance. Our garments are designed with a contemporary silhouette that balances structure and comfort.

      ### Women's Size Conversion
      | Size | UK | US | EU | IT |
      |------|----|----|----|----|
      | XS   | 6  | 2  | 34 | 38 |
      | S    | 8  | 4  | 36 | 40 |
      | M    | 10 | 6  | 38 | 42 |
      | L    | 12 | 8  | 40 | 44 |
      | XL   | 14 | 10 | 42 | 46 |

      ### How to Measure
      - **Bust**: Measure around the fullest part of your chest.
      - **Waist**: Measure around your natural waistline.
      - **Hips**: Measure around the fullest part of your hips.`
  },
  'shipping-returns': {
    title: 'Shipping & Returns',
    subtitle: 'Seamless delivery and effortless returns',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?w=1200&h=600&fit=crop',
    content: `We offer complimentary express shipping on all orders over $200. Every Nasseg piece is carefully packaged in our signature sustainable boxing.

      ### Shipping Times
      - **Standard**: 3-5 business days ($15)
      - **Express**: 1-2 business days ($30)
      - **International**: 5-7 business days ($50)

      ### Return Policy
      We accept returns within 30 days of delivery. Items must be in their original condition with all tags attached. Returns are complimentary for domestic orders.`
  },
  'order-tracking': {
    title: 'Order Tracking',
    subtitle: 'Follow your journey',
    image: 'https://images.unsplash.com/photo-1586864387917-f58a4b60bb3f?w=1200&h=600&fit=crop',
    content: `Once your order has been dispatched, you will receive a confirmation email with your tracking number. 

      You can use this number to track your shipment via our partner carriers. If you have an account, you can also view your order status in your dashboard.

      Please allow 24-48 hours for tracking information to become available.`
  },
  'faqs': {
    title: 'Frequently Asked Questions',
    subtitle: 'How can we help you?',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
    content: `### General Questions
      **Where are Nasseg products made?**
      Our collections are designed in our studio and crafted in Italy and Portugal using the finest materials.

      **Do you offer tailoring services?**
      Yes, complimentary basic alterations are available at our flagship stores for all full-price items.

      **How do I care for my cashmere?**
      We recommend professional dry cleaning or careful hand washing with specialized detergents.`
  },
  'contact-us': {
    title: 'Contact Us',
    subtitle: 'We are here for you',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=600&fit=crop',
    content: `Our dedicated client advisors are available to assist you with styling advice, product information, or order inquiries.

      ### Get in Touch
      - **Email**: care@nasseg.com
      - **Phone**: +1 (800) NASSEG-01
      - **WhatsApp**: +44 7700 900000

      ### Hours of Operation
      Monday - Friday: 9am - 8pm (EST)
      Saturday: 10am - 6pm (EST)`
  },
  'about': {
    title: 'About Nasseg',
    subtitle: 'The art of understated luxury',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    content: `Founded in 2018, Nasseg was born from a desire to create a wardrobe that transcends trends. We believe in the power of simplicity and the enduring value of exceptional craftsmanship.

      Our aesthetic is defined by clean lines, sophisticated textures, and a neutral palette that speaks to the modern minimalist. Every piece is a testament to our commitment to quality.

      From the sourcing of raw Mongolian cashmere to the final hand-finished detail, we prioritize the integrity of our process and the longevity of our products.`
  },
  'sustainability': {
    title: 'Sustainability',
    subtitle: 'Our commitment to the future',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=1200&h=600&fit=crop',
    content: `Responsibility is at the heart of everything we do. We strive to minimize our environmental footprint while maximizing our positive social impact.

      ### Materials
      We exclusively use natural fibers, including GOTS certified cotton, recycled cashmere, and ethically sourced wool.

      ### Production
      We partner only with factories that guarantee fair wages and safe working conditions. 90% of our production occurs within Europe to reduce transport emissions.`
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'Protecting your information',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
    content: `Your privacy is critically important to us. This policy explains how we collect, use, and protect your personal information when you use our website.

      We collect information you provide directly, such as when you create an account, make a purchase, or sign up for our newsletter. This includes your name, email address, and shipping information.

      We use industry-standard encryption to protect your data during transmission and storage.`
  },
  'terms-of-service': {
    title: 'Terms of Service',
    subtitle: 'The foundation of our relationship',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop',
    content: `By using the Nasseg website, you agree to comply with and be bound by the following terms and conditions.

      ### Intellectual Property
      All content on this site, including text, graphics, and logos, is the property of Nasseg and protected by international copyright laws.

      ### Limitation of Liability
      Nasseg shall not be liable for any damages arising out of the use or inability to use the materials on this site.`
  }
};
