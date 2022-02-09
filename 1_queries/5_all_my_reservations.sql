SELECT properties.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(rating) AS average_rating
FROM property_reviews
JOIN users ON guest_id = users.id
JOIN properties ON property_id = properties.id
JOIN reservations ON reservation_id = reservations.id
GROUP BY reservations.id,  properties.id, users.id 
HAVING users.id = 1
AND end_date < NOW()::DATE
ORDER BY start_date  
LIMIT 10;