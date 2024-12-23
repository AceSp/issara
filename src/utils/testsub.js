import React, {Component} from 'react';
import { Subscription } from '@apollo/client';
import POST_ADDED_SUBSCRIPTION from '../graphql/subscriptions/postAdded'; 

export class TestSub extends Component  {
    render() {
        return (
            <Subscription subscription={POST_ADDED_SUBSCRIPTION}>
                {data => {
                    console.log(data);
                    return null;
                }}
            </Subscription>
        );
    }
};