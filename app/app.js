/**
 * Created by Tom on 16.07.2017.
 */

$(function () {
    $("#datetimepicker").datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yyyy-mm-dd",
    });//.datepicker('update', new Date());
});

ko.bindingHandlers.select2 = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var obj = valueAccessor(), allBindings = allBindingsAccessor();
        var $el = $(element);
        var value = null;
        if (obj.data) {
            if (obj.data.results) {
                obj.data.results = ko.unwrap(obj.data.results);
            } else {
                if (ko.isObservable(obj.data)) {
                    obj.data.subscribe((newData) => {
                            obj.data = newData;
                            $el.select2(obj);
                        }
                    );
                    obj.data = ko.unwrap(obj.data);
                }
            }
        }
        if (obj.valuesObserver) {
            var silent = false;
            $el.on('change', function () {
                let data = $el.select2('data');
                if (data != obj.valuesObserver()) {
                    silent = true;
                    obj.valuesObserver(data);
                }
            });
            obj.valuesObserver.subscribe(function (newVal) {
                if (silent) {
                    silent = false;
                    return;
                }
                var newData, oldData;
                if (obj.multi) {
                    newData = _.pluck(newVal, 'id');
                    oldData = _.pluck($el.select2('data'), 'id');

                } else {
                    newData = newVal;
                    oldData = $el.select2('data');
                }
                if (!_.isEqual(newData, oldData)) {
                    $el.select2('data', newVal);
                }
            });
            value = obj.valuesObserver();
        }
        $el.select2(obj);
        if (obj.multiple) {
            if (value && value.length > 0) {
                $el.select2('val', typeof obj.id === 'function' ? _.map(value, item => obj.id(item)) : _.pluck(value, 'id')
                )
                ;
            }
        } else {
            if (value) {
                let id = typeof obj.id === 'function' ? obj.id(value) : value.id;
                if (id !== null && id !== undefined) {
                    $el.select2('val', id);
                }
            }
        }
        if (obj.valuesObserver && !obj.valuesObserver()) {
            $el.trigger('change');
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).select2('destroy');
        });
    },
    update: function (element, valueAccessor) {
        var obj = valueAccessor();
    }
};

var ViewModel = function() {

    this.ids = ko.observable();
    this.screenNames = ko.observable();
    this.query = ko.observable();

    this.country = ko.observable(null);
    this.countryName = function () {
        if (this.country()[0])
            return this.country()[0].full_name;
    };
    this.searchCountryId = function () {
        if (this.country()[0])
            return this.country()[0].id;
    };

    this.city = ko.observable(null);
    this.cityName = function () {
        if (this.city()[0])
            return this.city()[0].full_name;
    };
    this.searchCityId = function () {
        if (this.city()[0])
            return this.city()[0].id;
    };

    this.countryForSchool = ko.observable(null);
    this.countryForSchoolName = function () {
        if (this.countryForSchool()[0])
            return this.countryForSchool()[0].full_name;
    };
    this.countryForSchoolId = function () {
        if (this.countryForSchool()[0])
            return this.countryForSchool()[0].id;
    };

    this.cityForSchool = ko.observable(null);
    this.cityForSchoolName = function () {
        if (this.cityForSchool()[0])
            return this.cityForSchool()[0].full_name;
    };
    this.cityForSchoolId = function () {
        if (this.cityForSchool()[0])
            return this.cityForSchool()[0].id;
    };

    this.countryForUniversity = ko.observable(null);
    this.countryForUniversityName = function () {
        if (this.countryForUniversity()[0])
            return this.countryForUniversity()[0].full_name;
    };
    this.countryForUniversityId = function () {
        if (this.countryForUniversity()[0])
            return this.countryForUniversity()[0].id;
    };

    this.cityForUniversity = ko.observable(null);
    this.cityForUniversityName = function () {
        if (this.cityForUniversity()[0])
            return this.cityForUniversity()[0].full_name;
    };
    this.cityForUniversityId = function () {
        if (this.cityForUniversity()[0])
            return this.cityForUniversity()[0].id;
    };

    this.school = ko.observable(null);
    this.university = ko.observable(null);

    this.universityName = function () {
        if (this.university()[0])
            return this.university()[0].full_name;
    };
    this.universityId = function () {
        if (this.university()[0])
            return this.university()[0].id;
    };

    this.schoolName = function () {
        if (this.school()[0])
            return this.school()[0].full_name;
    };
    this.schoolId = function () {
        if (this.school()[0])
            return this.school()[0].id;
    };

    this.genderOptions = ko.observableArray([{value: "m", text: "Мужской"}, {value: "f", text: "Женский"}]);
    this.genderValue = ko.observable();

    this.ageFrom = ko.observable();
    this.ageTo = ko.observable();
    this.birthdate = ko.observable();

    this.companyName = ko.observable();
    this.jobName = ko.observable();
    this.groupId = ko.observable();

    this.friendLists = ko.observable(false);
    this.counters = ko.observable(false);

    this.formJsonRequest = function () {
        let json = {};
        if (this.ids()) {
            let arrayOfIds = this.ids().replace(/\s+/g, '').split(",");
            if (arrayOfIds.length > 0)
                json.ids = arrayOfIds;
        }
        if (this.query())
            json.query = this.query();
        if (this.screenNames()) {
            let arrayOfNicks = this.screenNames().replace(/\s+/g, '').split(",");
            if (arrayOfNicks.length > 0)
                json.screenNames = arrayOfNicks;
        }
        if (this.searchCountryId() && (json.countryId = this.searchCountryId()));
        if (this.searchCityId() && (json.cityId = this.searchCityId()));
        if (this.schoolId() && (json.schoolId = this.schoolId()));
        if (this.universityId() && (json.universityId = this.universityId()));
        if (this.ageFrom() && (json.ageFrom = this.ageFrom()));
        if (this.ageTo() && (json.ageTo = this.ageTo()));
        if (this.birthdate() && (json.birthdate = this.birthdate()));
        if (this.genderValue() && (json.gender = this.genderValue()));
        if (this.companyName() && (json.companyName = this.companyName()));
        if (this.jobName() && (json.jobName = this.jobName()));
        if (this.groupId() && (json.groupId = this.groupId()));
        if (this.friendLists() && (json.friendLists = this.friendLists()));
        if (this.counters() && (json.counters = this.counters()));
        console.log(json);
        alert(JSON.stringify(json));
    }
};

ko.applyBindings(new ViewModel());

$(".js-country-data-ajax").select2({
    theme: "classic",
    placeholder : "Выберите страну",
    allowClear: true,
    ajax: {
        url: "https://api.github.com/search/repositories",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page
            };
        },
        processResults: function (data, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            params.page = params.page || 1;

            return {
                results: data.items,
                pagination: {
                    more: (params.page * 30) < data.total_count
                }
            };
        },
        cache: true
    },
    escapeMarkup: function (markup) {return markup;},
    minimumInputLength: 1,
    templateResult: formatRepo, // omitted for brevity, see the source of this page
    templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});

$(".js-city-data-ajax").select2({
    theme: "classic",
    placeholder : "Выберите город",
    allowClear: true,
    ajax: {
        url: "https://api.github.com/search/repositories",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page
            };
        },
        processResults: function (data, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            params.page = params.page || 1;

            return {
                results: data.items,
                pagination: {
                    more: (params.page * 30) < data.total_count
                }
            };
        },
        cache: true
    },
    escapeMarkup: function (markup) {return markup;},
    minimumInputLength: 1,
    templateResult: formatRepo, // omitted for brevity, see the source of this page
    templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});

$(".js-school-data-ajax").select2({
    theme: "classic",
    placeholder : "Выберите школу",
    allowClear: true,
    ajax: {
        url: "https://api.github.com/search/repositories",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page
            };
        },
        processResults: function (data, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            params.page = params.page || 1;

            return {
                results: data.items,
                pagination: {
                    more: (params.page * 30) < data.total_count
                }
            };
        },
        cache: true
    },
    escapeMarkup: function (markup) {return markup;},
    minimumInputLength: 1,
    templateResult: formatRepo, // omitted for brevity, see the source of this page
    templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});

$(".js-university-data-ajax").select2({
    theme: "classic",
    placeholder : "Выберите университет",
    allowClear: true,
    ajax: {
        url: "https://api.github.com/search/repositories",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page
            };
        },
        processResults: function (data, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            params.page = params.page || 1;

            return {
                results: data.items,
                pagination: {
                    more: (params.page * 30) < data.total_count
                }
            };
        },
        cache: true
    },
    escapeMarkup: function (markup) {return markup;},
    minimumInputLength: 1,
    templateResult: formatRepo, // omitted for brevity, see the source of this page
    templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});

function formatRepo(repo) {
    if (repo.loading) return repo.text;

    var markup = "<div class='select2-result-repository clearfix'>" +
        "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
        "<div class='select2-result-repository__meta'>" +
        "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

    if (repo.description) {
        markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
    }

    markup += "<div class='select2-result-repository__statistics'>" +
        "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
        "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
        "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
        "</div>" +
        "</div></div>";

    return markup;
}

function formatRepoSelection(repo) {
    return repo.full_name || repo.text;
}
