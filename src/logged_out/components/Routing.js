import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Switch } from 'react-router-dom';
import PropsRoute from '../../shared/components/PropsRoute';
import BlogPost from './blog/BlogPost';
import Home from './home/Home';
import Map from './map/map';
function Routing(props) {
  const { blogPosts, selectBlog, selectHome } = props;
  return (
    <Switch>
      {blogPosts.map((post) => (
        <PropsRoute
          path={post.url}
          component={BlogPost}
          title={post.title}
          key={post.title}
          src={post.src}
          date={post.date}
          content={post.content}
          otherArticles={blogPosts.filter((blogPost) => blogPost.id !== post.id)}
        />
      ))}
      <PropsRoute
        exact
        path="/map"
        component={Map}
        // selectBlog={selectBlog}
        // blogPosts={blogPosts}
      />
      <PropsRoute path="/" component={Home} selectHome={selectHome} />
    </Switch>
  );
}

Routing.propTypes = {
  blogposts: PropTypes.arrayOf(PropTypes.object),
  selectHome: PropTypes.func.isRequired,
  selectBlog: PropTypes.func.isRequired,
};

export default memo(Routing);
