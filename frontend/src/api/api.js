import axios from 'axios';

export default {

// Authentication calls
auth() {
  return {
    // User cookie/session is destroyed. User needs to re-authenticate for API access
    logout: () => axios.get(`http://api.myshelf.nl/auth/logout`, {withCredentials: true}),
    // Get authentication status, returns {"authenticated": true/false}
    status: () => axios.get(`http://api.myshelf.nl/auth/status`, {withCredentials: true})
  }
},

// Returns information on the user's profile
profile: () => axios.get(`http://api.myshelf.nl/api/profile`,
  {withCredentials: true}),

// Search for a book
// search[field]=<EITHER 'title', 'author' OR 'all' (OPTIONAL, DEFAULT='all')>
search: (query, searchfield) => axios.get(`http://api.myshelf.nl/api/search`,
  {withCredentials: true,
  params: {
    'q': query,
    'search[field]': searchfield
  }}),

book() {
  return {
    // Get information on a book
    info: (book_id) => axios.get(`http://api.myshelf.nl/api/book`,
      {withCredentials: true, params: { 'id':book_id }}),
    // Add a book to an user's shelf
    add: (shelf_name, book_id) => axios.get(`http://api.myshelf.nl/api/add_book`,
      {withCredentials: true, params: { 'name':shelf_name, 'book_id':book_id }}),
    // Remove a book from an user's shelf
    remove: (shelf_name, book_id) => axios.get(`http://api.myshelf.nl/api/remove_book`,
      {withCredentials: true, params: { 'name':shelf_name, 'book_id':book_id }}),
  }
},

// Returns a list of all user's shelves
shelves: () => axios.get(`http://api.myshelf.nl/api/shelves`,
  {withCredentials: true}),

// Returns an overview of the books in an user's shelf
shelf: ( shelf_name, per_page ) => axios.get(`http://api.myshelf.nl/api/shelf`,
  {withCredentials: true, params: { 'shelf':shelf_name, 'per_page':per_page }}),

// Returns a list of coordinates corresponding to the locations of book in the uploaded picture
// (form should contain an image file and a threshold)
scan: ( form ) => axios('http://api.myshelf.nl/api/image', {
                    method: "post",
                    data: form,
                    withCredentials: true
                  })
}
