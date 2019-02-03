import {
    fetchAuth,
    getAPIBaseURL,
    NavbarTitle,
    isPositiveNumeric,
} from 'Utils'

const {
    Input,
    Row
} = FRC

const {
    ToastContainer
} = ReactToastr
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

Formsy.addValidationRule('isPositiveNumeric', isPositiveNumeric)

class ChangeVirementPage extends React.Component {

    constructor(props) {
        super(props)

        // Default state
        this.state = {
            canSubmit: false,
            memberId: '',
            bankTransferReference: '',
            amount: '',
        }
    }

    enableButton = () => {
        this.setState({canSubmit: true})
    }

    disableButton = () => {
        this.setState({canSubmit: false})
    }

    handleChange = (name, value) => {
        this.setState({[name]: value}, this.validateForm)
    }

    validateForm = () => {
        if (this.state.memberId && this.state.bankTransferReference
            && this.state.amount && isPositiveNumeric(null, this.state.amount)) {
            this.enableButton()
        } else {
            this.disableButton()
        }
    }

    submitForm = (data) => {
        this.disableButton()

        var postData = {}
        postData.member_login = this.state.memberId
        postData.bank_transfer_reference = this.state.bankTransferReference
        postData.amount = this.state.amount

        var promise = (response) => {
            this.refs.container.success(
                __("L'enregistrement s'est déroulé correctement."),
                "",
                {
                    timeOut: 5000,
                    extendedTimeOut: 10000,
                    closeButton:true
                }
            )

            setTimeout(() => window.location.assign('/operations'), 3000)
        }

        var promiseError = (err) => {
            // Error during request, or parsing NOK :(
            this.enableButton()

            console.error(this.props.url, err)
            this.refs.container.error(
                __("Une erreur s'est produite !"),
                "",
                {
                    timeOut: 5000,
                    extendedTimeOut: 10000,
                    closeButton:true
                }
            )
        }

        var url = getAPIBaseURL + "change-par-virement/"
        fetchAuth(url, 'POST', promise, postData, promiseError)
    }

    render = () => {
        return (
            <div className="row">
                <Formsy.Form
                    className="form-horizontal"
                    onValidSubmit={this.submitForm}>
                    <Input
                        name="memberId"
                        data-mlc="change-virement-member-id"
                        value={this.state.memberId}
                        label={__("Numéro d'adhérent-e")}
                        type="text"
                        validations="minLength:6,maxLength:6"
                        validationErrors={{
                            minLength: __("Le numéro d'adhérent-e doit comporter 6 caractères."),
                            maxLength: __("Le numéro d'adhérent-e doit comporter 6 caractères."),
                        }}
                        elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        required
                    />
                    <Input
                        name="bankTransferReference"
                        data-mlc="change-virement-bank-transfer-reference"
                        value={this.state.bankTransferReference}
                        label={__("Référence du virement")}
                        type="text"
                        elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        required
                    />
                    <Input
                        name="amount"
                        data-mlc="change-virement-amount"
                        value={this.state.amount}
                        label={__("Montant")}
                        type="number"
                        validations="isPositiveNumeric"
                        validationErrors={{
                            isPositiveNumeric: __("Montant invalide.")
                        }}
                        elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        required
                    />
                    <Row layout="horizontal">
                        <input
                            name="submit"
                            data-mlc="change-virement-submit"
                            type="submit"
                            defaultValue={__("Valider")}
                            className="btn btn-success"
                            formNoValidate={true}
                            disabled={!this.state.canSubmit}
                        />
                    </Row>
                </Formsy.Form>
                <ToastContainer ref="container"
                                toastMessageFactory={ToastMessageFactory}
                                className="toast-top-right toast-top-right-navbar" />
            </div>
        )
    }
}


ReactDOM.render(
    <ChangeVirementPage />,
    document.getElementById('change-virement')
)

ReactDOM.render(
    <NavbarTitle title={__("Change par virement")} />,
    document.getElementById('navbar-title')
)
