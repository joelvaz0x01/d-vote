const Ballot = artifacts.require("Ballot");

module.exports = function(deployer) {
    deployer.deploy(Ballot, ["Candidato 1", "Candidato 2", "Candidato 3", "Candidato 4", "Candidato 5"]);
};
