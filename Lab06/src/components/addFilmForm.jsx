import dayjs from "dayjs";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function AddFilmForm(props) {
  const [filmData, setFilmData] = useState({
    title: '',
    favorite: false,
    watchDate: '',
    rating: ''
  });

  const [errMsg, setErrMsg] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFilmData(oldData => ({
      ...oldData,
      [name]: type === 'checkbox' ? checked : value
    }));

    setErrMsg('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (filmData.title.trim() === '') {
      setErrMsg('Please insert title.');
      return;
    }

    if (
      filmData.rating !== '' &&
      (Number(filmData.rating) < 0 || Number(filmData.rating) > 5)
    ) {
      setErrMsg('Rating must be between 0 and 5.');
      return;
    }

    setErrMsg('');

    const newFilm = {
      title: filmData.title.trim(),
      favorite: filmData.favorite,
      watchDate: filmData.watchDate ? dayjs(filmData.watchDate) : null,
      rating: filmData.rating === '' ? null : Number(filmData.rating)
    };

    props.onSave(newFilm);
  };

  return (
    <Form onSubmit={handleSubmit}>

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={filmData.title}
          onChange={handleChange}
          isInvalid={errMsg !== '' && filmData.title.trim() === ''}
        />
        <Form.Control.Feedback type="invalid">
          Please insert title.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Favorite"
          name="favorite"
          checked={filmData.favorite}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Watch Date</Form.Label>
        <Form.Control
          type="date"
          name="watchDate"
          value={filmData.watchDate}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <Form.Control
          type="number"
          name="rating"
          min={0}
          max={5}
          value={filmData.rating}
          onChange={handleChange}
          isInvalid={
            errMsg === 'Rating must be between 0 and 5.'
          }
        />
        <Form.Control.Feedback type="invalid">
          Rating must be between 0 and 5.
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-center mt-3 gap-2">
        <Button type="button" onClick={props.onCancel}>
          Cancel
        </Button>

        <Button type="submit">
          Save
        </Button>
      </div>
    </Form>
  );
}

export default AddFilmForm;