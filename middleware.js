const list = require("./Modals/listing.js");

// ==========================================
// isLoggedIn
// Blocks access unless the user is logged in.
// Used before letting anyone view/submit the
// "create club" form.
// ==========================================
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // save where the user was trying to go so we can
        // send them back there after they log in
        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "Please sign up or login first to create a club."
        );

        return res.redirect("/login");
    }

    next();
};


// ==========================================
// isOwner
// Only the user who created a club can edit
// or delete it.
// ==========================================
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const clubListing = await list.findById(id);

    if (!clubListing) {
        req.flash("error", "Club not found.");
        return res.redirect("/listings");
    }

    if (!clubListing.owner || !clubListing.owner.equals(req.user._id)) {
        req.flash(
            "error",
            "You don't have permission to edit or delete this club."
        );
        return res.redirect(`/listings/${id}`);
    }

    next();
};
