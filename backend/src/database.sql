-- users table
CREATE TABLE users (
    user_id serial primary key,
    username varchar(255) unique not null,
    email varchar(255) unique not null,
    password varchar(255) not null,
    created_at date default current_date
);
-- hospitals table
CREATE TABLE hospitals (
    hospital_id serial primary key,
    hospital_name varchar(255) unique not null,
    hospital_location varchar(255) not null,
    hospital_link varchar(255) not null,
    average_rating FLOAT not null DEFAULT 0,
    latitude FLOAT not null,  -- Latitude of the hospital
    longitude FLOAT not null, -- Longitude of the hospital
    estimated_waiting_time varchar(255) not null,
    created_at date default current_date
);


-- treatmentplan table
CREATE TABLE treatmentplan (
    treatmentplan_id serial primary key,
    user_id INT REFERENCES users(user_id),
    medicine_name varchar(255)  not null,
    medicine_quantity varchar(255) not null,
    medicine_time varchar(255) not null,
    notes varchar(255) not null,
    created_at date default current_date
);

-- treatmentplan table
CREATE TABLE weights (
    weights_id serial primary key,
    user_id INT REFERENCES users(user_id),
    distance_weight int  not null,
    time_weight int not null,
    rate_weight int not null,
    created_at date default current_date
);

-- reviews table
CREATE TABLE reviews (
    review_id serial primary key,
    user_id INT REFERENCES users(user_id),
    hospital_id INT REFERENCES hospitals(hospital_id),
    rating INT not null,
    hospital_feedback varchar(255) not null,
    created_at date default current_date
);

-- triggers for rating
CREATE OR REPLACE FUNCTION update_hospital_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the average rating for the hospital
  UPDATE hospitals
  SET average_rating = (
    SELECT AVG(rating)
    FROM reviews
    WHERE hospital_id = NEW.hospital_id
  )
  WHERE hospital_id = NEW.hospital_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for insert or update
CREATE TRIGGER after_review_insert_update
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_hospital_average_rating();

-- Trigger for delete
CREATE TRIGGER after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_hospital_average_rating();

-- 
CREATE OR REPLACE FUNCTION update_hospital_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the operation is a delete
  IF TG_OP = 'DELETE' THEN
    -- Update the average rating for the hospital after deletion
    UPDATE hospitals
    SET average_rating = (
      SELECT AVG(rating)
      FROM reviews
      WHERE hospital_id = OLD.hospital_id
    )
    WHERE hospital_id = OLD.hospital_id;
  ELSE
    -- Update the average rating for the hospital after insert or update
    UPDATE hospitals
    SET average_rating = (
      SELECT AVG(rating)
      FROM reviews
      WHERE hospital_id = NEW.hospital_id
    )
    WHERE hospital_id = NEW.hospital_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;