import React from 'react';
import { 
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  InputAdornment,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const ProductFilters = ({ filters, handleFilterChange, categories, vendor }) => {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
      <Box
        component="form"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: vendor?.vendor_id ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)'
          },
          gap: 2,
          alignItems: 'center'
        }}
      >
        {/* Search Input */}
        <TextField
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search products..."
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Category Select */}
        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem 
                key={category.category_id} 
                value={category.category_id}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Select */}
        <FormControl size="small" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="out_of_stock">Unavailable</MenuItem>
            <MenuItem value="reject">Reject</MenuItem>
            <MenuItem value="in_stock">In Stock</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>

        {/* Limit Select */}
        <FormControl size="small" fullWidth>
          <InputLabel>Items per page</InputLabel>
          <Select
            name="limit"
            value={filters.limit}
            onChange={handleFilterChange}
            label="Items per page"
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="5">5 / Page</MenuItem>
            <MenuItem value="10">10 / Page</MenuItem>
            <MenuItem value="20">20 / Page</MenuItem>
            <MenuItem value="50">50 / Page</MenuItem>
          </Select>
        </FormControl>

        {/* Add Product Button */}
        {vendor?.vendor_id && (
          <Button
            component={Link}
            to="/vendor/product/add"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              height: '40px',
              whiteSpace: 'nowrap'
            }}
            className='bg-secondary'
          >
            Add Product
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ProductFilters;