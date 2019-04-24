<?php

namespace GDM\LMS\Models {

    use SilverStripe\ORM\DataObject;

    class BusinessRole extends DataObject
    {
        private static $table_name = "BusinessRole";
        private static $singular_name = "Business Role";
        private static $plural_name = "Business Roles";

        private static $db = [
            'Name' => 'Varchar'
        ];
    }
}