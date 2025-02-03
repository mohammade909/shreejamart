import React, { useState } from 'react';
import { ChevronDown, Menu, Clock, MapPin, BadgePercent } from 'lucide-react';
import {fetchCategories} from '../../redux/categorySlice'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

const SecondaryNav = () => {
  const dispatch = useDispatch();
  const {categories} = useSelector(state => state.categories);
  const [openDropdown, setOpenDropdown] = useState(null);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const navItems = [
    {
      name: 'Home',
      items: [
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Analytics', link: '/analytics' },
        { name: 'Overview', link: '/overview' },
      ],
    },
    {
      name: 'Categories',
      items: categories.length > 0
        ? categories.map((cat) => ({ name: cat.name, link: `/products?category=${cat.category_id}` }))
        : [
            { name: 'Electronics', link: '/categories/electronics' },
            { name: 'Fashion', link: '/categories/fashion' },
            { name: 'Home & Garden', link: '/categories/home-garden' },
            { name: 'Sports', link: '/categories/sports' },
          ],
    },
    {
      name: 'Products',
      items: [
        { name: 'New Arrivals', link: '/products' },
        { name: 'Best Sellers', link: '/products' },
        { name: 'Featured', link: '/products' },
        { name: 'Deals', link: '/products' },
      ],
    },
    {
      name: 'Blog',
      items: [
        { name: 'Latest Posts', link: '/blogs' },
        { name: 'Popular', link: '/blogs' },
        { name: 'Authors', link: '/blogs' },
        { name: 'Categories', link: '/blogs' },
      ],
    },
    {
      name: 'Pages',
      items: [
        { name: 'About Us', link: '/about-us' },
        { name: 'Contact', link: '/contact' },
        { name: 'FAQ', link: '/faq' },
        { name: 'Terms', link: '/terms' },
      ],
    },
  ];
  const handleDropdownEnter = (dropdownName) => {
    setOpenDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-white border-b hidden lg:block">
      <div className="max-w-6xl lg-max:w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* All Categories Button */}
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary">
              <i class="fi fi-rr-apps"></i>
              <span>All Categories</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute z-50 hidden group-hover:block w-48 bg-white border rounded-md shadow-lg py-2 mt-1">
              {categories.map((category)=>(
                <Link to={`/products?category=${category.category_id}`} key={category.category_id} className="block px-4 py-2 text-gray-800 hover:bg-secondary hover:text-white">{category.name}</Link>
              ))}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(item.name)}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex text-sm font-medium items-center space-x-1 text-primary tracking-wider hover:text-secondary">
                  <span>{item.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {openDropdown === item.name && (
                  <div className="absolute z-50 w-48 bg-white border rounded-md shadow-lg py-2 mt-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.link}
                        className="block px-4 py-2 text-gray-800 hover:text-secondary"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-green-500">
              <BadgePercent className="h-5 w-5" />
              <span>Offers</span>
            </button>
            <button className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-emerald-600">
              <MapPin className="h-5 w-5" />
              <span>New York</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNav