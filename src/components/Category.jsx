import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import changeFilter from '../actions/filter';

const Category = ({ plant, category }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  if (!plant) {
    return null;
  }

  const { image_url: imageUrl } = plant;
  const handleClick = () => {
    dispatch(changeFilter(category));
    history.push({
      pathname: '/category-product',
      search: `?category=${category}`,
    });
  };
  return (
    <div
      data-testid="category-container"
      className="col-sm-6 col-md-4"
      onClick={handleClick}
      role="presentation"
      onKeyDown={handleClick}
    >
      <div className="category d-flex justify-content center flex-column">
        <img src={imageUrl} alt="category" />
      </div>
      <>
        <h4>{category.toUpperCase()}</h4>
      </>
    </div>
  );
};
Category.defaultProps = {
  plant: null,
};
Category.propTypes = {
  plant: PropTypes.objectOf(PropTypes.any),
  category: PropTypes.string.isRequired,
};

export default Category;
