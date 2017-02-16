import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as searchActions from 'actions/search';
import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

@connect(
    state => ({
        search: state.search
    }),
    dispatch => ({
        searchActions: bindActionCreators(searchActions, dispatch)
    })
)
export default class Search extends Component {
    componentWillMount() {
        const query = this.props.location.query.query;
        if(query) {
            this.props.searchActions.search(query);
        }
    }

    componentDidUpdate(prevProps) {
        const query = this.props.location.query.query;
        if(prevProps.location.query.query != query) {
            this.props.searchActions.search(query);
        }
    }

    render() {
        const {
            search
        } = this.props;

        return (
            <main className="search">
                {search.query ? (
                    <div>
                        <PageTopper title="Search" />
                        <div className="container--lg">
                            <p>Searching for <span>{search.query}</span></p>
                        </div>
                        <div className="container--lg container--poster">
                            {search.loaded && search.results.length > 0 ? search.results.map((result, i) => (
                                <Poster item={result} actions={true} key={i} />
                            )) : search.loaded && search.results.length == 0 ? (
                                <p>No results</p>
                            ) : search.loading ? (
                                <div className="loading">
                                    <Spinner size="large" />
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </main>
        );
    }
}
