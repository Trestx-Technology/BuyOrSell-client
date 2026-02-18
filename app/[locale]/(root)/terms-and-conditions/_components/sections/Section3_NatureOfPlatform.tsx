import React from "react";
import { SectionWrapper } from "../SectionWrapper";

export const Section3NatureOfPlatform = () => (
  <SectionWrapper id="nature-of-platform" title="Nature of the Platform and Services" number="3">
    <p>
      3.1 <a href="https://www.buyorsell.ae" className="text-purple hover:underline font-medium">www.buyorsell.ae</a> is an online classifieds marketplace where users within the United Arab
      Emirates can browse, post, and respond to listings across the following categories (which may
      evolve over time):
    </p>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pl-4 mt-6">
      {[
        { title: "Motors", desc: "Cars, motorcycles, boats, trucks, vans, vehicle parts, accessories, tyres, and automotive services" },
        { title: "Property", desc: "Apartments, villas, townhouses, offices, commercial spaces, plots, short-term rentals, and real estate services" },
        { title: "Jobs", desc: "Full-time, part-time, freelance, remote work, internships, and recruitment services" },
        { title: "Electronics & Mobiles", desc: "Smartphones, laptops, tablets, TVs, cameras, gaming consoles, chargers, and accessories" },
        { title: "Fashion", desc: "Clothing, shoes, bags, watches, sunglasses, and designer items" },
        { title: "Home & Garden", desc: "Furniture, appliances, kitchenware, décor, tools, gardening equipment, and home improvement" },
        { title: "Baby & Kids", desc: "Strollers, cribs, clothing, toys, books, car seats, and childcare items" },
        { title: "Sports & Fitness", desc: "Gym equipment, bikes, outdoor gear, sports apparel, and fitness accessories" },
        { title: "Books, Stationery & Gifts", desc: "Textbooks, novels, comics, office supplies, and gift items" },
        { title: "Services", desc: "Home services (cleaning, repairs), beauty, health, tutoring, photography, and professional services" },
        { title: "Community", desc: "Classes, lessons, clubs, lost & found, pets, and local groups" },
        { title: "Events", desc: "Tickets, workshops, concerts, parties, weddings, and event management" },
        { title: "Business", desc: "Equipment, office furniture, industrial tools, wholesale, and investment opportunities" }
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-base">
          <span className="text-purple mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-purple/20"></span>
          <span className="leading-snug"><strong>{item.title}:</strong> <span className="text-gray-600">{item.desc}</span></span>
        </li>
      ))}
    </ul>
    <p className="mt-8">
      3.2 We reserve the right to add, modify, merge, split, or remove categories and subcategories
      at any time, without notice, to reflect market demand, legal requirements, or Platform
      improvements.
    </p>
    <p>
      3.3 We are a classifieds platform only — not a seller, buyer, dealer, agency, broker, or
      service provider. All transactions (sales, rentals, hires, jobs, events) are directly between
      users. We do not:
    </p>
    <ul className="list-disc pl-10 space-y-3">
      <li>Own, inspect, verify, endorse, or guarantee any listings, items, services, jobs, properties, or events</li>
      <li>Handle payments, escrow, shipping, delivery, contracts, or disputes between users</li>
      <li>Act as an employment agency, real estate broker, or event organiser</li>
    </ul>
    <p>
      3.4 Listings must accurately describe the item or service in the correct category. Prohibited
      listings include illegal items (drugs, weapons, counterfeits), adult content, financial services
      without a valid UAE Central Bank licence, medical advice without DHA/HAAD approval, or
      anything requiring special UAE approvals without proof.
    </p>
    <p>
      3.5 We do not pre-screen listings but may, at our sole discretion, review, edit, hide, or delete
      content that violates these Terms, UAE laws, or harms users or Platform integrity. Use of the
      Platform is at your own risk — always verify sellers and buyers independently.
    </p>
  </SectionWrapper>
);
