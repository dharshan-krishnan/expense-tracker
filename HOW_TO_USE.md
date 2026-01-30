# Expense Tracker - How to Use (Fixed Version)

## Status: ✅ All Network Errors Fixed

Your expense tracker is fully functional with proper error handling and authentication.

---

## Getting Started

### 1. **Backend Status** (Java Spring Boot)
- **URL**: http://localhost:8080
- **Status**: ✅ Running
- **Database**: MySQL (localhost:3306)

### 2. **Frontend Status** (React)
- **URL**: http://localhost:3000
- **Status**: ✅ Running with latest fixes

---

## First Time Setup

### Step 1: Create an Account
1. Go to http://localhost:3000/signup
2. Enter an email and password
3. Click "Sign Up"
4. You'll be redirected to login page

### Step 2: Log In
1. Go to http://localhost:3000/login (or click "Login" link)
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the Dashboard

### Step 3: Start Using
Once logged in, you can:

#### 📊 Dashboard
- View category-wise spending pie chart
- See monthly expense trends
- Compare budgets vs actual expenses

#### 💰 Expenses
- Add new expenses with title, amount, date, and category
- Edit existing expenses
- Delete expenses
- View all expenses in a list

#### 💵 Budgets
- Set budgets for categories
- Track monthly spending against budgets
- Monitor budget utilization

#### 📂 Categories
- Create custom expense categories
- Edit existing categories
- Delete categories

---

## Features

✅ **Authentication**
- JWT token-based security
- Automatic token refresh on page reload
- Automatic logout on token expiration

✅ **Error Handling**
- Graceful error messages
- Network error recovery
- User-friendly error displays

✅ **Charts & Visualization**
- Pie charts for category-wise spending
- Bar charts for monthly trends
- Budget vs expense comparison

✅ **Data Persistence**
- All data stored in MySQL database
- User-specific data isolation

---

## Troubleshooting

### "Network Error" or "Failed to fetch"
**Solution**: 
- Check that backend is running on port 8080
- Check that frontend is running on port 3000
- Try logging in first - data endpoints require authentication

### "Login failed"
**Solution**:
- Verify email exists (you signed up with it)
- Check password is correct
- Make sure backend is running

### "Failed to load data" in dashboard
**Solution**:
- Make sure you're logged in
- Check browser console for detailed error
- Ensure token is being stored in localStorage

### Database Connection Error
**Solution**:
- Ensure MySQL is running: `mysql -u root -p`
- Create database: `CREATE DATABASE expense_tracker;`
- Verify credentials in `backend/src/main/resources/application.properties`

---

## Development Notes

### Backend Configuration
Location: `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=root
server.port=8080
```

### Frontend Configuration
Location: `frontend/src/services/api.js`

```javascript
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
```

### API Endpoints
All endpoints require JWT token in `Authorization: Bearer <token>` header

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/summary` - Get expense summary by category
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Add budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category
- `DELETE /api/categories/{id}` - Delete category

---

## Testing

### Test Data
Create test expenses and budgets to populate charts:
1. Create a category (e.g., "Food", "Transport")
2. Add budgets for categories
3. Add expenses with dates
4. Charts will automatically update

### Sample Test Data
- Category: "Food" - Budget: 5000
- Category: "Transport" - Budget: 2000
- Expense: "Lunch" - 500 - Food category
- Expense: "Taxi" - 200 - Transport category

---

## Next Steps

1. ✅ Sign up with your email
2. ✅ Log in to dashboard
3. ✅ Create categories
4. ✅ Set budgets
5. ✅ Add expenses
6. ✅ View charts and reports

Enjoy tracking your expenses! 💰📊
