package presence.pages;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import net.serenitybdd.screenplay.targets.Target;

public class PresenceTest implements Question<SubstantialPresence> {
    private static final Target RESULT = Target
        .the("substantial presence test result")
        .locatedBy(".test-result");


    @Override
    public SubstantialPresence answeredBy(Actor actor) {
        String result = Text.of(RESULT)
            .viewedBy(actor)
            .asString();

        if (result.equals("")) {
            return SubstantialPresence.NO_RESULT;
        }

        if (result.contains("do not have")) {
            return SubstantialPresence.DOES_NOT_HAVE_PRESENCE;
        }

        return SubstantialPresence.HAS_PRESENCE;
    }

    public static PresenceTest result() {
        return new PresenceTest();
    }
}
