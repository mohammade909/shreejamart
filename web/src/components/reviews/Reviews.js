import React, { useState, useEffect } from "react";
import { 
  Tabs, 
  Tab, 
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Divider
} from "@mui/material";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import {BASEURL} from '../../baseurl'
const Reviews = () => {
  const [currentTab, setCurrentTab] = useState("products");
  const [productReviews, setProductReviews] = useState([]);
  const [partnerReviews, setPartnerReviews] = useState([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${BASEURL}/api/v1/reviews`
        );
        const data = await response.data;
        setProductReviews(data.productReviews);
        setPartnerReviews(data.partnerReviews);
        setPagination(data.pagination);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "contained" : "outlined"}
            size="small"
            onClick={() => onPageChange(page)}
            sx={{ minWidth: '2rem' }}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outlined"
          size="small"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Box>
    );
  };

  const ReviewCard = ({ review }) => (
    <Card sx={{ mb: 2 }}>
     <Link to={`/dashboard/${currentTab}/${review.entity_id}`} >   
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {review.first_name} {review.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{review.username}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {review.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Star className="h-4 w-4" style={{ fill: '#facc15', color: '#facc15' }} />
            <Typography variant="body1" fontWeight="medium">
              {review.rating}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {review.review}
        </Typography>
        <Box sx={{ 
          mt: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'text.secondary'
        }}>
    
          <Typography variant="body2">{formatDate(review.review_created_at)}</Typography>
        </Box>
      </CardContent>
      </Link>
    </Card>
  );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: '64rem', mx: 'auto' }}>
      <Typography variant="h5" fontWeight="semibold" sx={{ mb: 3 }}>
        Reviews Dashboard
      </Typography>

      <Box sx={{ width: '100%' }} className="bg-white border border-gray-300">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab
            label={`Product Reviews (${productReviews?.length})`} 
            value="products"
            sx={{ flex: 1 ,}}
          />
          <Tab 
            label={`Partner Reviews (${partnerReviews?.length})`} 
            value="partners"
            sx={{ flex: 1 }}
          />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {currentTab === "products" && (
            <Box>
              {productReviews?.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}
            </Box>
          )}

          {currentTab === "partners" && (
            <Box>
              {partnerReviews?.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ mt: 3, pt: 3 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'text.secondary'
        }}>
          <Typography variant="body2">
            Showing {currentTab === "products" ? productReviews?.length : partnerReviews?.length} of {pagination?.totalReviews} reviews
          </Typography>
          <Typography variant="body2">
            Page {pagination?.currentPage} of {pagination?.totalPages}
          </Typography>
        </Box>
        
        <Pagination
          currentPage={pagination?.currentPage}
          totalPages={pagination?.totalPages}
          onPageChange={(page) => console.log("Page changed to:", page)}
        />
      </Box>
    </Box>
  );
};

export default Reviews;