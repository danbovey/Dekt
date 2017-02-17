import React, { Component, cloneElement } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import clickOutside from 'react-outside';
import classNames from 'classnames';

import './styles';

export default class Dropdown extends Component {
    static defaultProps = {
        closeOnClick: true,
        trigger: ['click']
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    setVisible(visible) {
        this.setState({
            visible
        }, () => {
            if(this.props.onVisibleChange) {
                this.props.onVisibleChange(this.state.visible);
            }
        });
    }

    toggle() {
        this.setVisible(!this.state.visible);
    }

    render() {
        const {
            className,
            closeOnClick,
            dark,
            disabled,
            trigger
        } = this.props;

        const {
            visible
        } = this.state;

        const triggerClassName = 'btn--dropdown';

        const btnProps = {
            className: classNames(this.props.children.props.className, triggerClassName)
        };
        trigger.forEach(t => {
            switch(t) {
                case 'hover':
                    btnProps.onMouseOver = this.open.bind(this);
                    btnProps.onMouseOver = this.close.bind(this);
                    break;
                default:
                    btnProps.onClick = this.toggle.bind(this);
                    break;
            }
        });
        const children = cloneElement(this.props.children, btnProps);

        const menu = cloneElement(this.props.menu, {
            handleClickOutside: (e) => {
                let isDropdownBtn = false;
                let el = e.target;
                for(let i = 0; i < 5; i++) {
                    if(el && el.classList.contains(triggerClassName)) {
                        isDropdownBtn = true;
                    }
                    el = el.parentNode;
                }
                if(!isDropdownBtn) {
                    this.setVisible(false);
                }
            },
            onClick: (e) => {
                if(closeOnClick) {
                    const cL = e.target.classList;
                    if(cL.contains('dropdown__item') && !cL.contains('dropdown__item--disabled')) {
                        this.setVisible(false);
                    }
                }
            }
        });

        return (
            <div
                className={classNames('dropdown', className, {
                    'dropdown--disabled': disabled,
                    'dropdown--dark': dark
                })}
            >
                {children}
                <ReactCSSTransitionGroup
                    transitionName="dropdown__menu-"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}
                >
                    {visible ? menu : null}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
};

@clickOutside()
export class Menu extends Component {
    constructor(props) {
        super(props);

        this.handleClickOutside = props.handleClickOutside;
    }

    render() {
        const {
            children,
            onClick,
            placement
        } = this.props;

        return (
            <ul
                className={classNames('dropdown__menu', {
                    'dropdown__menu--right': placement == 'right'
                })}
                onClick={onClick}
            >
                {children}
            </ul>
        );
    }
}

export const Item = ({ children, disabled, link, onClick }) => (
    <li
        className={classNames('dropdown__item', {
            'dropdown__item--disabled': disabled,
            'dropdown__item--link': link
        })}
        onClick={!disabled ? onClick : null}
    >
        {children}
    </li>
);


export const Divider = () => (
    <hr className="dropdown__divider"/>
);
