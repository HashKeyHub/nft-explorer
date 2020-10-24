import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Skeleton from '@material-ui/lab/Skeleton';
import { GridListTile } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
}));

function Variants() {
  return (
    <div>
      <Skeleton variant="rect" width={210} height={118} />
    </div>
  );
}

function PresentsList({ loading, presents }) {
  const classes = useStyles();

  if (loading) {
    return <GridList component={Variants} />;
  }

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={3}>
        {presents.map((tile, index) => (
          <GridListTile key={tile.title + index}>
            <img src={tile.uri} alt={tile.title} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

PresentsList.propTypes = {
  loading: PropTypes.bool,
  presents: PropTypes.any,
};

export default PresentsList;
