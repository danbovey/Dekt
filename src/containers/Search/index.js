import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

@connect(
    state => ({
        
    }),
    dispatch => ({
        
    })
)
export default class Search extends Component {
    render() {
        const {
            location: { query }
        } = this.props;

        return (
            <main className="home">
                {query.query ? (
                    <div>
                        <PageTopper title="Search" />
                        <div className="container-lg">
                            <p>Searching for {query.query} </p>
                        </div>
                    </div>
                ) : null}
            </main>
        );
    }
}
