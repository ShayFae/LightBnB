SELECT properties.id ,properties.title, properties.cost_per_night, AVG(property_reviews.rating) AS average_rating
FROM properties
JOIN property_reviews ON property_id = properties.id
WHERE province = 'Yukon'
GROUP BY properties.id, properties.id,properties.cost_per_night
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;