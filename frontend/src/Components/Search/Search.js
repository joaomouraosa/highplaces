import React, { Component } from "react";
import Product from '../Product/Product';
import Main from '../Main/Main'
import './Search.css'
import {API_PATH, STATIC_PATH} from '../../config/defaults'


class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchKey: '', items: [], filtered_items: [], item: "", product_selected: "", category_path: [], current_page: 0
        };
        this.onSearchChange = this.onSearchChange.bind(this);
        this.getProductFromChildCallback = this.getProductFromChildCallback.bind(this);
        this.callBackItem = this.callBackItem.bind(this);
        this.is_path = this.is_path.bind(this);

    }

    fetchItems() {
        fetch(API_PATH +"/products").then(response => response.json()).then(result => this.setState({ items: result })).catch(error => error);
    }

    add_to_tree(tree, element) {
        if (element.level == 0) {
            tree.push({ [element.id]: { ...element, "children": [] } });
            return tree;
        }
        tree.forEach((e) => {
            let key = Object.keys(e)[0];
            if (key == element.parent) {
                e[key].children.push({ [element.id]: { ...element, "children": [] } });
                return tree;
            }
            else {
                return this.add_to_tree(e[key].children, element);
            }
        })
    }

    is_Category(element, category) {

    }

    fetchCategories() {
        fetch(API_PATH + "/categories").then(response => response.json()).then(result => this.setState({ categories: result })).then(
            () => {
                let tree = [];
                this.state.categories.forEach((e) => {
                    this.add_to_tree(tree, e)
                });
                this.setState({ tree: tree });
            })
            .catch(error => error);
        //pesquisa em profundidade e guardar uma estrutura com as categorias.

    }

    async fetchItem(item_id) {
        let promise = await fetch(API_PATH +  "/products/" + item_id)
        let response = await promise.json()
        this.setState({ item: response[0] });
        this.props.callbackFromParent(response[0]);
        this.updatePage();
    }

    getProductFromChildCallback(productFromChild) {
        this.setState({ product_selected: productFromChild })
        this.props.callbackFromParent(productFromChild);
    }

    componentDidMount() {
        this.fetchCategories();
        this.fetchItems();
    }

    onSearchChange(event) {
        this.setState({ searchKey: event.target.value });
    }

    updatePage() {
        this.props.callbackCurrentPage("product");
    }

    prepareListCategories(obj) {
        let ref = [];

        for (let i = 0; i < obj.length; i++) {
            if (obj[i].level == 0) { //criar novo 
                let c = { ...obj[i], children: [] }
                ref.push(c)
            }
            if (obj[i].level == 1) { //adicionar ao do nivel 0
                ref.map((e) => {
                    if (e.id == obj[i].parent) {
                        let c = { ...obj[i], children: [] }
                        e.children.push(c)
                    }
                });
            }
            if (obj[i].level == 2) { //adicionar ao do nivel 1,
                ref.map((e) => {
                    e.children.map((e2) => {
                        if (e2.id == obj[i].parent) {
                            e2.children.push(obj[i])
                        }
                    });
                });
            }
        }
        return ref;
    }

    callBackItem(current_cat) {
        this.setState({ current_category: current_cat });
        this.fetchCategory(this.state.current_category);
    }

    fetchCategory(category) {
        fetch(API_PATH + "/categories/" + category).then(response => response.json()).then(result => this.setState({ items: result })).catch(error => error);
    }


    handleCategoryPath(item_id, level, name) {

        let path = this.state.category_path; //[1,2,3]
        while (path.length > level)
            path.pop();

        if (level > 0)
            path.push(item_id);
        else
            path = [item_id];
        this.setState({ category_path: path, category_name: name });
    }

    is_path(element1, tree, p_) {
        let path = this.state.category_path;
        let found = false;
        is_path(element1, tree, p_);

        function is_path(element1, tree, p_) {
            if (found == true)
                return true;

            for (let e of tree) {
                let key = parseInt(Object.keys(e)[0]);

                if (key == element1) {
                    p_ = [...p_, key];
                    if (path.length == 1 && p_[0] == path[0]) {
                        found = true;
                        return true;
                    }
                    else if (path.length == 2 && p_[0] == path[0] && p_[1] == path[1]) {
                        found = true;
                        return true;
                    }
                    else if (path.length == 3 && p_[0] == path[0] && p_[1] == path[1] && p_[2] == path[2]) {
                        found = true;
                        return true;
                    }
                }
                else if (e[key].children != [] && found != true) {
                    is_path(element1, e[key].children, [...p_, key]);
                }
            }
            return found
        }
        return found;
    }


    render() {
        //    alert(JSON.stringify(this.state), null, 4);

        let cats;
        if (this.state.categories != undefined) {
            cats = this.state.categories.map((item) => {
                if (this.state.category_path.includes(item.parent)) {
                    if (item.level == 1)
                        return <h2 onClick={() => this.handleCategoryPath(item.id, item.level, item.name)} > {item.name} </h2>
                    return <h3 onClick={() => this.handleCategoryPath(item.id, item.level, item.name)} > {item.name} </h3>
                }
                if (item.parent == null) {
                    return <h1 onClick={() => this.handleCategoryPath(item.id, item.level, item.name)} > {item.name} </h1>
                }
            });

        }

        let counter = 0;
        let page_counter = 0;
        let items = this.state.items.map((it) => {
            page_counter = parseInt(counter / 9);
            counter += 1;
            if ((page_counter <= this.state.current_page) &&
                (it.name.includes(this.state.searchKey) && (this.state.category_path.length == 0 || this.is_path(it.id, this.state.tree, [])))) {
                return <a href={"#"} onClick={() => { this.fetchItem(it.id) }}>
                    <div id={"item_id_" + it.id} page={page_counter}>
                        <img src={STATIC_PATH + "/images/products/" + it.id + ".png"} />
                        <h3>{it.name}</h3><h3>{it.price}€</h3>
                    </div>
                </a >
            }
        })

        return (
            <div className="products_list">
                <div className="search_item">
                    <input type="text" placeholder="Search..." id="search_item_input" value={this.state.searchKey} onChange={this.onSearchChange} />
                </div>

                <div className="categories_list">
                    <ul className="categories">
                        <h1 onClick={() => this.setState({ current_category: "", category_path: [] })} > SHOP </h1>
                        {cats}
                    </ul>
                </div>
                <div className="search_options">
                </div>
                <div className="list_items">
                    {this.state.category_name != undefined ? <h1>{this.state.category_name}</h1> : <h1>Shop</h1>}
                    <div className="items">
                        {items}
                    </div>
                </div>
                <div className="page_selection">
                    {parseInt(this.state.items.length / 9) > this.state.current_page &&
                        <button id="load_more" onClick={() => this.setState({ current_page: this.state.current_page += 1 })}> Load more</button>
                    }

                </div>

            </div>

        );
    }
}

export default Search;