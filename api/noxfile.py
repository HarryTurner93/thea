"""Define the suite of tests, linters, and formatters."""

# Third Party Imports
import nox

# Constants.
locations = "inspect_flask", "tests", "noxfile.py"


@nox.session(python=["3.8"])
def tests(session):
    """Run the test suite."""
    session.install("-r", "requirements.txt")
    session.install("pytest")
    session.install("pytest-cov")
    session.run(
        "python",
        "-m",
        "pytest",
        "-vv",
        "--cov",
        "inspect_flask",
        "--cov-report",
        "term-missing",
        external=True,
    )


@nox.session(python="3.8")
def isort(session):
    """Run isort code formatter."""
    session.install("isort")
    session.run("isort", *locations)


@nox.session(python=["3.8"])
def black(session):
    """Run black code formatter."""
    session.install("black")
    session.run("black", *locations)


@nox.session(python=["3.8"])
def lint(session):
    """Lint using flake8."""
    session.install(
        "flake8",
        "flake8-annotations",
        "flake8-black",
        "flake8-bugbear",
        "flake8-docstrings",
        "flake8-import-order",
        "darglint",
    )
    session.run("flake8", *locations)
