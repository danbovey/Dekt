import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

@connect(
    state => ({
        show: state.show
    }),
    dispatch => ({
        showActions: bindActionCreators(showActions, dispatch)
    })
)
export default class Search extends Component {
    componentWillMount() {
        if(this.props.show.loading == false) {
            const title = this.props.params.title;

            this.props.showActions.load(title);
        }
    }

    render() {
        const {
            show
        } = this.props;

        return (
            <main className="show">
                {show.item ? (
                    <PageTopper item={show.item} title={show.item.show.title} />
                ) : null}
                <div className="container--lg">
                    {show.item ? (
                        <p>{show.item.show.title}</p>
                    ) : null}
                </div>
            </main>
        );
    }
}
