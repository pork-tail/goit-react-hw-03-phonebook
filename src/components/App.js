import React, { Component } from "react";
import { v4 as uuid } from "uuid";
import ContactForm from "./contactForm/ContactForm";
import ContactList from "./contactList/ContactList";
import Filter from "./filter/Filter";

class App extends Component {
  state = {
    contacts: [],
    filter: "",
  };

  componentDidMount() {
    console.log("[componentDidMount]");
    const contacts = localStorage.getItem("contacts");
    if (contacts) {
      const parsedContacts = JSON.parse(contacts);
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[componentDidUpdate]");
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
    }
  }

  handleSubmit = (name, number) => {
    const isDuplicate = this.state.contacts.some((item) => item.name === name);
    if (isDuplicate) {
      alert("Такой контакт уже существует " + name);
      return;
    }

    const newContact = {
      id: uuid(),
      name: name,
      number: number,
    };

    this.setState((prevState) => {
      const newContacts = [newContact, ...prevState.contacts];
      return { contacts: newContacts };
    });
  };

  handleDelete = (id) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter((contact) => contact.id !== id),
    }));
  };

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  render() {
    const { contacts, filter } = this.state;
    const formattedFilter = filter.toLowerCase().trim();
    const filteredContacts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(formattedFilter)
    );
    return (
      <div>
        <h1>Phonebook</h1>
        <ContactForm handleSubmit={this.handleSubmit} />
        {contacts.length ? (
          <>
            <h2>Contacts</h2>
            <Filter filter={filter} handleChange={this.handleChange} />
            <ContactList
              contacts={filteredContacts}
              handleDelete={this.handleDelete}
            />
          </>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
