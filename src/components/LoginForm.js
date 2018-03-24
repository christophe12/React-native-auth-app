import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import { Card, CardSection, Button, Input, Spinner } from './common';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailInput: '',
            passwordInput: '',
            error: '',
            loading: false
        };
        this.buttonPress = this.buttonPress.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.onLoginFailure = this.onLoginFailure.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
    }

    onLoginFailure(error) {
        this.setState({
            error: error.message,
            loading: false
        });
    }

    onLoginSuccess(success) {
        console.log(success);
        this.setState({
            emailInput: '',
            passwordInput: '',
            loading: false,
            error: ''
        });
    }

    buttonPress() {
        const { emailInput, passwordInput } = this.state;
        this.setState({ error: '', loading: true });
        firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
            .then(success => this.onLoginSuccess(success))
            .catch(() => {
                firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput)
                    .then(success => this.onLoginSuccess(success))
                    .catch(error => this.onLoginFailure(error));
            });
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner />;
        }

        return (
            <Button onPress={() => this.buttonPress()}>
                Log in
            </Button>
        );
    }
    render() {
        return (
            <Card>
                <CardSection>
                    <Input 
                    secureTextEntry={undefined}
                    placeholder="user@gmail.com"
                    label="Email"
                    value={this.state.emailInput}
                    onChangeText={emailInput => this.setState({ emailInput })}
                    />
                </CardSection>

                <CardSection>
                    <Input 
                    secureTextEntry
                    placeholder="password"
                    label="Password"
                    value={this.state.passwordInput}
                    onChangeText={passwordInput => this.setState({ passwordInput })}
                    />
                </CardSection>
                <View style={styles.errorContainerStyle}>
                    <Text style={styles.errorTextStyle}>
                        {this.state.error}
                    </Text>
                </View>
                <CardSection>
                    { this.renderButton() }
                </CardSection>
            </Card>
        );
    }
}

const styles = {
    errorContainerStyle: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTextStyle: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 18,
        color: 'red'
    }
};

export default LoginForm;
