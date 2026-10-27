import sqlite3
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)
DB_NAME = "tours.db"


def get_db_connection():
    """Створює підключення до бази даних з доступом до колонок за назвами."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Ініціалізує базу даних, створюючи таблицю tours, якщо вона не існує."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tours (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image TEXT
        )
    """
    )
    conn.commit()
    conn.close()


# Головна сторінка
@app.route("/")
def index():
    return render_template("index.html")


# Про нас
@app.route("/about")
def about():
    return render_template("about.html")


# Перегляд турів
@app.route("/tours")
def tours():
    conn = get_db_connection()
    tours_list = conn.execute("SELECT * FROM tours").fetchall()
    conn.close()
    return render_template("tours.html", tours=tours_list)


# Додавання туру (GET - форма, POST - збереження)
@app.route("/add_tour", methods=["GET", "POST"])
def add_tour():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        price_raw = request.form.get("price", "").strip()
        image = request.form.get("image", "").strip()

        # Серверна валідація даних
        errors = []
        if not title:
            errors.append("Назва туру не може бути порожньою.")

        try:
            price = float(price_raw)
            if price <= 0:
                errors.append("Ціна повинна бути більшою за 0.")
        except ValueError:
            errors.append("Будь ласка, введіть коректну ціну.")

        if not image:
            image = "default.jpg"

        if errors:
            return render_template(
                "add_tour.html", errors=errors, form_data=request.form
            )

        # Безопечна вставка параметризованим запитом (?)
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO tours (title, description, price, image) VALUES (?, ?, ?, ?)",
            (title, description, price, image),
        )
        conn.commit()
        conn.close()

        return redirect(url_for("tours"))

    return render_template("add_tour.html")


# Галерея
@app.route("/gallery")
def gallery():
    return render_template("gallery.html")


# Контакти
@app.route("/contacts")
def contacts():
    return render_template("contacts.html")


if __name__ == "__main__":
    init_db()  # Створення таблиці до запуску сервера
    app.run(debug=True)